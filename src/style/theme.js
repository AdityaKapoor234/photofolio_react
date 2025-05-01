// Import styled-components library for creating styled components
import styled from "styled-components";

/**
 * ThemeContainer - A styled div component that provides theme-based styling
 * 
 * Features:
 * - Dynamic background color based on props (default: transparent)
 * - Dynamic text color based on props (default: inherit)
 * - Full viewport height (min-height: 100vh)
 * - No margin or padding by default
 * 
 * Props:
 * color - Background color value (optional)
 * textColor - Text color value (optional)
 */
export const ThemeContainer = styled.div`
    /* Dynamic background color with fallback to transparent */
    background-color: ${(props) => props?.color || "transparent"};

    /* Dynamic text color with fallback to inherit */
    color: ${(props) => props?.textColor || "inherit"};

    /* Minimum height of full viewport */
    min-height: 100vh;

    /* Reset default margins */
    margin: 0;

    /* Reset default padding */
    padding: 0;
`;