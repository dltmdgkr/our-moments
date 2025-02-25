import styled from "styled-components";

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <ProgressBarBoundary>
      <ProgressFill percent={percent}>{percent}%</ProgressFill>
    </ProgressBarBoundary>
  );
}

const ProgressBarBoundary = styled.div`
  border: 1px solid black;
  margin-bottom: 20px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number }>`
  background-color: green;
  height: 30px;
  padding-top: 10px;
  border-radius: 10px;
  text-align: center;
  color: white;
  transition: width 0.3s ease-in-out;
  width: ${({ percent }) => percent || 0}%;
`;
