import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { CssBaseline } from "@mui/material";
import QueryProvider from "@/providers/query-provider";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/navbar/navbar";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export default function RootLayout(props) {
    const { children } = props;
    return (
        <html lang="en" className={roboto.variable}>
            <body>
                <AppRouterCacheProvider>
                    <QueryProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <ToastProvider>
                                <Navbar />
                                {children}
                            </ToastProvider>
                        </ThemeProvider>
                    </QueryProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
