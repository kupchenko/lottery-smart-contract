import Web3 from 'web3'
import {EventData} from 'web3-eth-contract'
import lotteryJson from './contract.json'
import emitter from '../events/events'

declare type AbiItem = import("web3-utils").AbiItem;

type Address = string
type Amount = string // amounts are always presented as strings

// Network settings have more properties, but we're only interested in the `address`
type NetworkSettings = Record<string, { address: Address }>

const projectUrl = process.env['PROJECT_URL']
const networkId = process.env['NETWORK_ID']

const networkSettings = lotteryJson.networks as NetworkSettings
const CONTRACT_ABI = lotteryJson.abi as unknown as AbiItem
const CONTRACT_ADDRESS = networkSettings[networkId ?? 17000]?.address as Address

if (!CONTRACT_ADDRESS || !CONTRACT_ABI) {
  throw new Error('Contact address is empty');
}

export const web3 = new Web3(Web3.givenProvider ?? projectUrl)

export const lotteryContract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
)

// We want to inform to the Frontend when the contract emits WinnerPicked event
// passing the event object, which contains all the details sent in the event.
lotteryContract.events.WinnerPicked((error: Error, event: EventData) => {
  if (error) {
    emitter.emit('error-picking-winner', error)
  } else {
    emitter.emit('winner-picked', event)
  }
})

export const getAddressBalance = async (address: Address) => {
  let balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance)
}

export const pickWinner = async (from: Address): Promise<string> => {
  try {
    return await lotteryContract.methods.pickWinner().send({ from })
  } catch (error: any) {
    if (error) {
      // @ts-ignore
      const errorJson = error?.message?.replaceAll('Internal JSON-RPC error.', '');
      const jsonErrorObject = JSON.parse(errorJson);
      return Promise.reject(jsonErrorObject.message);
    }
    return Promise.reject("pickWinner failed");
  }
}

export const getContractOwner = async (): Promise<string> => {
  return await lotteryContract.methods.owner().call()
}

/**
 * @param from address entering the game
 * @param ether amount sent to the pool by the participant
 * @param nickname nickname
 */
export const enterLottery = async (
  from: Address,
  ether: Amount,
  nickname: string
): Promise<string> => {
  try {
    return lotteryContract.methods.enter(nickname).send({
      from,
      value: web3.utils.toWei(ether)
    })
  } catch (e) {
    let message = "enterLottery failed"
    if (e instanceof Error) {
      message = e.message;
    }
    return new Promise(() => message);
  }
}

export const getParticipants = async () => {
  return lotteryContract.methods.getParticipants().call()
}

/**
 * This function will prompt the user for permission to connect their wallet
 * @returns list of connected wallet's accounts
 */
export async function requestAccounts(): Promise<Address[]> {
  return web3.eth.requestAccounts()
}

export function toEth(balance: string): string {
  return web3.utils.fromWei(balance)
}

