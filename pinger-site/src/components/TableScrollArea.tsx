import { useEffect, useState } from 'react';
import { ScrollArea, Table } from '@mantine/core';
import { GetRequest } from '../requests/GetRequest';
import cx from 'clsx';
import classes from './TableScrollArea.module.css';
import { format } from 'date-fns';

interface DataItem {
  id: number;
  IP: string;
  PingTime: number;
  LastChecked: string;
}

export function TableScrollArea() {
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState<DataItem[] | null>([]);
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
            <Table.Th>Ping time</Table.Th>
            <Table.Th>Last successful check</Table.Th>
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
                <Table.Td>{row.IP}</Table.Td>
                <Table.Td>{row.PingTime}</Table.Td>
                <Table.Td>{format(new Date(row.LastChecked), 'dd MMMM yyyy, HH:mm:ss')}</Table.Td>

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