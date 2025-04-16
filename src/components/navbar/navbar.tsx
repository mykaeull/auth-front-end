import { Fragment } from "react";
// import Image from "next/image";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { AppBar, Toolbar } from "@mui/material";

import { SessionData, sessionOptions } from "@/lib/utils/iron-sesison";

import LinksNavbar from "./links";
import ProfileButton from "./profile-button";

// import Logo from "../../../public/assets/logo.svg";

const navbarLinks = [
    {
        name: "Agendamentos",
        pathname: "/agendamentos",
        isActive: true,
    },
    {
        name: "Dashboard",
        pathname: "/dashboard",
        isActive: true,
    },
];

export default async function Navbar() {
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );

    if (!session || !session.token) return null;

    return (
        <AppBar
            position="sticky"
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                paddingY: "16px",
            }}
        >
            <Toolbar
                sx={{
                    width: "100%",
                    maxWidth: "1600px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* <Image src={Logo} width={200} height={40} alt="logo" /> */}
                <Fragment>
                    <LinksNavbar navbarLinks={navbarLinks} />
                    <ProfileButton name={session.name} email={session.email} />
                </Fragment>
            </Toolbar>
        </AppBar>
    );
}
