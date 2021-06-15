import styled from "@emotion/styled";
import Link from "next/link";

const NotFoundContainer = styled.div({
  width: "100vw",
  height: "100vh",
  position: "fixed",
  left: 0,
  top: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  textAlign: "center",
  flexDirection: "column",
});

export default function NotFound() {
  return (
    <NotFoundContainer>
      <h1>Where am I? 👀</h1>
      Oops, that page doesn't exist.
      <div>
        <Link href={"/"}>
          <a>Return Home</a>
        </Link>
      </div>
    </NotFoundContainer>
  );
}
