import styled from "styled-components";
import BackButton from "../components/common/BackButton";
import EditForm from "../components/gallery/EditForm";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirmModal } from "../context/ConfirmModalProvider";
import { AuthContext } from "../context/AuthProvider";

export default function EditPage() {
  const { postId } = useParams();
  const { me } = useContext(AuthContext);
  const { openModal } = useConfirmModal();
  const navigate = useNavigate();
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axiosInstance.get(`/images/${postId}`);
        const post = res.data;

        if (!me) {
          navigate("/");
          return;
        }

        setOriginalPost(post);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        navigate("/");
      }
    };

    fetchPostData();
  }, []);

  return (
    <PageWrapper>
      <BackButtonWrapper>
        <BackButton
          onClick={() =>
            openModal({
              title: "작성을 종료하시겠습니까?",
              description: "작성 중이신 내용은 삭제됩니다.",
              onConfirm: () => navigate(-1),
            })
          }
        />
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
