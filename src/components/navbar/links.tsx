"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Stack } from "@mui/material";

interface LinksNavbarProps {
    navbarLinks: {
        name: string;
        pathname: string;
        isActive: boolean;
    }[];
}

export default function LinksNavbar({ navbarLinks }: LinksNavbarProps) {
    const pathname = usePathname();

    return (
        <Stack display="flex" flexDirection="row" gap={3} alignItems="center">
            {navbarLinks.map((link) => (
                <Link
                    {...(!link.isActive && {
                        className: "pointer-events-none",
                    })}
                    key={link.pathname}
                    href={link.pathname}
                >
                    <Button
                        disabled={!link.isActive}
                        sx={{
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: "400",
                            color: pathname.startsWith(
                                link.pathname.split("?")[0]
                            )
                                ? "primary"
                                : "text.secondary",
                        }}
                    >
                        {link.name}
                    </Button>
                </Link>
            ))}
        </Stack>
    );
}
