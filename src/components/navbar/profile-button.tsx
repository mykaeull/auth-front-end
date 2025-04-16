"use client";

import { Fragment, useState } from "react";
import {
    Button,
    Divider,
    ListItemText,
    ListItemIcon,
    Menu,
    MenuItem,
    MenuList,
} from "@mui/material";

import { KeyboardArrowDown, Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function ProfileButton({
    name,
    email,
}: {
    name: string;
    email: string;
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const open = Boolean(anchorEl);

    return (
        <Fragment>
            <Button
                color="warning"
                endIcon={<KeyboardArrowDown />}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "400",
                }}
            >
                {name}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                <MenuList>
                    <MenuItem disabled={true}>{email}</MenuItem>
                    <Divider />
                    <MenuItem onClick={() => router.replace("/logout")}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Sair</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Fragment>
    );
}
