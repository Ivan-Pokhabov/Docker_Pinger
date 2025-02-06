import { useEffect, useState } from 'react';
import { ScrollArea, Table } from '@mantine/core';
import { GetRequest } from '../requests/GetRequest';
import cx from 'clsx';
import classes from './TableScrollArea.module.css';

interface DataItem {
  ip: string;
  ping_time: number;
  last_checked: string;
}

export function TableScrollArea() {
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState<DataItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const response = await GetRequest();
      setData(response.length ? response : []);
      setError(null);
    } catch {
      setError("Данных нет");
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 10000);
    return () => clearInterval(intervalId);
  }, []);

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
        <Table.Tbody>
          {error ? (
            <Table.Tr>
              <Table.Td colSpan={3} style={{ textAlign: 'center', color: 'red' }}>
                {error}
              </Table.Td>
            </Table.Tr>
          ) : data && data.length > 0 ? (
            data.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>{row.ip}</Table.Td>
                <Table.Td>{row.ping_time}</Table.Td>
                <Table.Td>{row.last_checked}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3} style={{ textAlign: 'center', color: 'gray' }}>
                Нет данных
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
