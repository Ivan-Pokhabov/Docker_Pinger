import { useEffect, useState } from 'react';
import { ScrollArea, Table } from '@mantine/core';
import { GetRequest } from '../requests/GetRequest';
import cx from 'clsx';
import classes from './TableScrollArea.module.css';

interface DataItem {
  Docker_IP: string;
  Last_Time_Checked: string;
  Status: string;
}

export function TableScrollArea() {
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);

  const loadData = async () => {
    try {
      const response = await GetRequest();
      setData(response);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    loadData();

    const intervalId = setInterval(loadData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const rows = data.map((row) => (
    <Table.Tr key={"Lol"}>
      <Table.Td>{row.Docker_IP}</Table.Td>
      <Table.Td>{row.Last_Time_Checked}</Table.Td>
      <Table.Td>{row.Status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table miw={700}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>Docker IP</Table.Th>
            <Table.Th>Last Time Check</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}