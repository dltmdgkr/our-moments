import styled from "styled-components";
import BackButton from "../components/common/BackButton";
import EditForm from "../components/gallery/EditForm";
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { useConfirmModal } from "../context/ConfirmModalProvider";

export default function EditPage() {
  const { postId } = useParams();
  const { openModal } = useConfirmModal();
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axiosInstance.get(`/images/${postId}`);
        setOriginalPost(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPostData();
  }, []);

  return (
    <PageWrapper>
      <BackButtonWrapper>
        <BackButton onClick={openModal} />
      </BackButtonWrapper>
      {originalPost && <EditForm originalPost={originalPost} />}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  padding: 24px;
`;

const BackButtonWrapper = styled.div`
  margin-bottom: 16px;
`;
