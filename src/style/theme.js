import styled from "styled-components";

export const ThemeContainer = styled.div`
    background-color: ${(props) => props?.color || "transparent"};
    color: ${(props) => props?.textColor || "inherit"};
    min-height: 100vh;
    margin: 0;
    padding: 0;
`;