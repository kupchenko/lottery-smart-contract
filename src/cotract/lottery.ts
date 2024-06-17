import Web3 from 'web3'
import {EventData} from 'web3-eth-contract'
import lotteryJson from './contract.json'
import emitter from '../events/events'

declare type AbiItem = import("web3-utils").AbiItem;

type Address = string
type Amount = string // amounts are always presented as strings

// Network settings have more properties, but we're only interested in the `address`
type NetworkSettings = Record<string, { address: Address }>

const projectUrl = process.env['NEXT_PUBLIC_PROJECT_URL']
const networkId = process.env['NEXT_PUBLIC_NETWORK_ID']

const networkSettings = lotteryJson.networks as NetworkSettings
const CONTRACT_ABI = lotteryJson.abi as unknown as AbiItem
const CONTRACT_ADDRESS = networkSettings[networkId ?? 17000]?.address as Address

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

export const getLotteryTotalBank = async (address: Address) => {
  let balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance)
}

const pickWinner = async () => {
  return lotteryContract.methods.pickWinner().call()
}

/**
 * @param from address entering the game
 * @param ether amount sent to the pool by the participant
 */
export const enterLottery = async (
  from: Address,
  ether: Amount,
): Promise<string> => {
  return lotteryContract.methods.enter().send({
    from,
    value: web3.utils.toWei(ether),
  })
}

export const getParticipants = async (from: Address) => {
  return lotteryContract.methods.getParticipants().call({ from })
}
