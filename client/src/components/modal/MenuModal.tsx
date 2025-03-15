import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { axiosInstance } from "../../utils/axiosInstance";

interface MenuModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const modalVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  leaving: {
    x: -500,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const MenuModal = ({ openModal, setOpenModal }: MenuModalProps) => {
  const { me, setMe, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axiosInstance.patch("/users/logout");
      setMe(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("sessionId");
    }
  };

  if (isLoading) return null;

  return (
    <AnimatePresence>
      {openModal ? (
        <Wrapper onClick={() => setOpenModal(false)}>
          <Lists
            variants={modalVariants}
            initial="initial"
            animate="visible"
            exit="leaving"
          >
            <List>
              <Link to={"/"}>홈</Link>
            </List>
            <List>
              <Link to={"/gallery"}>갤러리</Link>
            </List>
            {me ? (
              <List>
                <span onClick={logoutHandler}>로그아웃</span>
              </List>
            ) : (
              <>
                <List>
                  <Link to="/signup">회원가입</Link>
                </List>
                <List>
                  <Link to="/login">로그인</Link>
                </List>
              </>
            )}
          </Lists>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
};

const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  z-index: 7;
  height: 100vh;
  background: rgba(173, 175, 179, 0.5);
  cursor: pointer;
`;

const Lists = styled(motion.ul)`
  width: 25%;
  height: 100vh;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const List = styled.li`
  padding: 15px 20px;
  font-size: 18px;
  border-bottom: 1px solid #ddd;
  background: #fff;

  &:hover {
    background: none;
  }
`;
