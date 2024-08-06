import Button from '@/components/atoms/Button/Button';
import MemoTimeSelect from '@/components/organisms/Memo/MemoTimeSelect';
import MemoTagSelect from '@/components/organisms/Memo/MemoTagSelect';
import KindergartenInfomationSelect from '@/components/organisms/Memo/KindergartenInfomationSelect';
import Header from '@/components/organisms/Navigation/Header';
import NavigationBar from '@/components/organisms/Navigation/NavigationBar';
import {containerHeaderClass} from '@/styles/styles';
import {postMemo} from '@/apis/memo/postMemo';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useRecoilState} from 'recoil';
import {memoState} from '@/recoil/atoms/memo/memo';
import {Memo} from '@/types/memo/Memo';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/atoms/Loader/Spinner';
import {useQueryString} from '@/hooks/useQueryString';
import {useQuery} from '@tanstack/react-query';
import {getMemoById} from '@/apis/memo/getMemoById';

const teacherId = 1;

const MemoWrite = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [memo, setMemo] = useRecoilState(memoState);

  const [isValid, setIsValid] = useState(false);

  const memoId = useQueryString().get('id');

  const {data} = useQuery({
    queryKey: ['memo', teacherId, memoId],
    queryFn: () => {
      return getMemoById(teacherId, memoId!);
    },
    enabled: !!memoId,
  });

  const writeMutate = useMutation({
    mutationFn: ({teacherId, memo}: {teacherId: number; memo: Memo}) => {
      return postMemo(teacherId, memo);
    },
    onError() {
      toast.error('오류 발생');
    },
    onSuccess() {
      setMemo({
        updatedTime: dayjs(),
        lesson: '',
        kids: [],
        tagRequestDtos: [],
        content: '',
      });
      queryClient.invalidateQueries({
        queryKey: ['memos', 1],
      });
      navigate('/kindergarten/memo');
    },
  });

  useEffect(() => {
    setIsValid(
      memo.content !== '' ||
        memo.kids.length !== 0 ||
        memo.lesson !== '' ||
        memo.tagRequestDtos.length !== 0
    );
  }, [memo]);

  useEffect(() => {
    if (data !== undefined) {
      setMemo(data);
    } else {
      setMemo({
        updatedTime: dayjs(),
        lesson: '',
        kids: [],
        tagRequestDtos: [],
        content: '',
      });
    }
  }, [data, setMemo]);

  const handleClick = () => {
    writeMutate.mutate({teacherId, memo});
  };

  return (
    <>
      {writeMutate && writeMutate.status === 'pending' ? <Spinner /> : null}
      <div className={`${containerHeaderClass} flex flex-col h-full bg-white`}>
        <Header title="관찰 메모 작성" buttonType="back" />
        <div className="flex-grow px-5 py-5 space-y-8 overflow-y-scroll">
          <MemoTimeSelect />
          <MemoTagSelect />
          <KindergartenInfomationSelect />
        </div>
        <div className="px-5 py-6 h-fit min-h-fit min-w-fit">
          <Button
            variant={isValid ? 'positive' : 'negative'}
            disabled={!isValid}
            label="메모 작성하기"
            onClick={handleClick}
            size="large"
          />
        </div>
        <NavigationBar />
      </div>
      <ToastContainer
        position="top-center" // 알람 위치 지정
        autoClose={300} // 자동 off 시간
        hideProgressBar // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        theme="light"
      />
    </>
  );
};

export default MemoWrite;
