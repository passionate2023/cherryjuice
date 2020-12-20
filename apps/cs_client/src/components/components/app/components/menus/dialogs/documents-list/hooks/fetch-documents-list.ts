import { useEffect, useRef } from 'react';
import { ac } from '::store/store';

type Props = {
  userId: string;
  online: boolean;
  showDocumentList: boolean;
};

export const useFetchDocumentsList = ({
  userId,
  online,
  showDocumentList,
}: Props) => {
  const firstFetch = useRef(true);
  useEffect(() => {
    if (userId && online && (firstFetch.current || showDocumentList)) {
      firstFetch.current = false;
      const handle = setTimeout(
        ac.documentsList.fetchDocuments,
        showDocumentList ? 1500 : 150,
      );
      return () => {
        clearInterval(handle);
      };
    }
  }, [showDocumentList, online, userId]);
};
