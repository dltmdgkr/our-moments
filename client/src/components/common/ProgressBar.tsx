import styled from "styled-components";

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <BarWrapper>
      <BarFill percent={percent} />
      <PercentText>{percent}%</PercentText>
    </BarWrapper>
  );
}

const BarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 16px; /* 기존 8px → 16px로 높이 증가 */
  background-color: #d7d7d7;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
`;

const BarFill = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent || 0}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #4caf50,
    #388e3c
  ); /* 더 진한 초록 그라데이션 */
  transition: width 0.3s ease-in-out;
  border-radius: 8px;
`;

const PercentText = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 500;
  color: white;
  z-index: 1;
  pointer-events: none;
`;
