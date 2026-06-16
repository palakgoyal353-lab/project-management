import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            let currentIsDark = document.documentElement.classList.contains("dark");
            const theme = currentIsDark ? "light" : "dark";
            localStorage.setItem("theme", theme);
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            state.theme = theme;
        },
        setTheme: (state, action) => {
            const theme = action.payload;
            state.theme = theme;
            localStorage.setItem("theme", theme);

            let isDark = false;
            if (theme === "system") {
                isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            } else {
                isDark = theme === "dark";
            }

            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },
        loadTheme: (state) => {
            let theme = localStorage.getItem("theme");
            if (!theme) {
                theme = "system";
            }
            state.theme = theme;

            let isDark = false;
            if (theme === "system") {
                isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            } else {
                isDark = theme === "dark";
            }

            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },
    },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;
export default themeSlice.reducer;
