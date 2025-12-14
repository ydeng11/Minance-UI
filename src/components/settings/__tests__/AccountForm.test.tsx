import React from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AccountForm, type AccountFormValues } from "../AccountForm";

vi.mock("@/components/ui/select", () => {
    return {
        Select: ({ value, onValueChange, children }: any) => (
            <select
                data-testid="mock-select"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
            >
                {children}
            </select>
        ),
        SelectTrigger: ({ children }: any) => <div>{children}</div>,
        SelectContent: ({ children }: any) => <>{children}</>,
        SelectItem: ({ value, children }: any) => (
            <option value={value}>{children}</option>
        ),
        SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    };
});

const banks = ["CHASE", "BANK_OF_AMERICA"];
const accountTypes = ["CREDIT", "CHECKING"];

const baseValues: AccountFormValues = {
    bankName: "",
    accountName: "",
    accountType: "",
    initBalance: 0,
};

describe("AccountForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("prevents submission until all required fields are provided", () => {
        const onSubmit = vi.fn();
        render(
            <AccountForm
                mode="create"
                initialValues={baseValues}
                supportedBanks={banks}
                supportedAccountTypes={accountTypes}
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /save account/i }));
        expect(screen.getByText(/bank is required/i)).toBeVisible();
        expect(screen.getByText(/account name is required/i)).toBeVisible();
        expect(screen.getByText(/type is required/i)).toBeVisible();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("submits normalized values when the form is valid", () => {
        const onSubmit = vi.fn();
        render(
            <AccountForm
                mode="create"
                initialValues={baseValues}
                supportedBanks={banks}
                supportedAccountTypes={accountTypes}
                onSubmit={onSubmit}
            />
        );

        fireEvent.change(screen.getByTestId("mock-select"), { target: { value: "CHASE" } });
        fireEvent.change(screen.getByLabelText(/Account Name/i), { target: { value: " Travel Card " } });
        fireEvent.change(screen.getAllByTestId("mock-select")[1], { target: { value: "CREDIT" } });
        fireEvent.change(screen.getByLabelText(/Starting Balance/i), { target: { value: "123.45" } });

        fireEvent.click(screen.getByRole("button", { name: /save account/i }));
        expect(onSubmit).toHaveBeenCalledWith({
            bankName: "CHASE",
            accountName: "Travel Card",
            accountType: "CREDIT",
            initBalance: 123.45,
        });
    });

    it("renders existing values in edit mode", () => {
        const existing: AccountFormValues = {
            bankName: "BANK_OF_AMERICA",
            accountName: "Checking",
            accountType: "CHECKING",
            initBalance: 900,
        };

        render(
            <AccountForm
                mode="edit"
                initialValues={existing}
                supportedBanks={banks}
                supportedAccountTypes={accountTypes}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByDisplayValue("BANK_OF_AMERICA")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Checking")).toBeInTheDocument();
        expect(screen.getByDisplayValue("CHECKING")).toBeInTheDocument();
        expect(screen.getByDisplayValue("900")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
    });
});
