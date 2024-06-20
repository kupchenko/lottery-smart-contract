import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/shadcn/ui/table";
import React from "react";

export type TableColumn = {
  title: string
  index: string
  transform?: (val: any) => any
}

type DefaultTableProps = {
  columns: Array<TableColumn>
  data?: Array<any>
  total?: string
}

export const DefaultTable = ({total, columns, data}: DefaultTableProps) => {
  return (
    <Table className="m-auto">
      <TableHeader>
        <TableRow>
          {
            columns.map(value => (
              <TableHead>{value.title}</TableHead>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data?.map((item, index) => {
            return (
              <TableRow key={index}>
                {
                  columns.map(value => {
                    if (value.transform) {
                      return <TableCell>{value.transform(item[value.index])}</TableCell>
                    }
                    return <TableCell>{item[value.index]}</TableCell>
                  })
                }
              </TableRow>
            )
          })
        }
      </TableBody>
      {total && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}