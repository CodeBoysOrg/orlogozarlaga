"use client";
import React, { useState } from "react";
import PillTabs from "@/components/ui/PillTabs";
import InputField from "@/components/ui/InputField";

const AddTransaction = () => {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income",
  );
  const [account, setAccount] = useState("Cash");
  const [incomeType, setIncomeType] = useState("Salary");
  const [expenseType, setExpenseType] = useState("Food");
  const [accountIsOpen, setAccountIsOpen] = useState(false);
  const [typeIsOpen, setTypeIsOpen] = useState(false);

  return (
    <div className="bg-white h-fit p-5 fixed top-8 right-8 rounded-xl flex flex-col items-center gap-3 w-90">
      <PillTabs
        active={transactionType}
        onChange={(v) => setTransactionType(v as "income" | "expense")}
        tabs={[
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ]}
      />
      <div className=" w-full relative">
        <div
          className={`flex cursor-pointer flex-col rounded-lg p-2 bg-[#A6C3C3] w-full`}
          onClick={() => {
            setAccountIsOpen(!accountIsOpen);
            setTypeIsOpen(false);
          }}>
          <p>{account}</p>
          <p className="text-end">1,000,000 ￥</p>
        </div>
        {accountIsOpen && (
          <div className="absolute bg-[#216869] rounded-lg mt-2 w-[80%] right-0 z-10 flex flex-col p-2 gap-2 text-[#F1F3F2]">
            {Array.from({ length: 2 }).map((_, index) => (
              <button
                className="py-1 px-2 rounded hover:bg-[#49A078] cursor-pointer text-left"
                key={index}
                onClick={() => {
                  setAccount(index === 0 ? "Cash" : "Bank");
                  setAccountIsOpen(false);
                }}>
                {index === 0 ? "Cash" : "Bank"}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className=" w-full relative">
        <div
          className={`flex cursor-pointer flex-col rounded-lg p-2 bg-[#B6D9C9] w-full `}
          onClick={() => {
            setTypeIsOpen(!typeIsOpen);
            setAccountIsOpen(false);
          }}>
          <p>{transactionType === "income" ? incomeType : expenseType}</p>
          <p className="text-end">1,000,000 ￥</p>
        </div>
        {typeIsOpen && (
          <div className="absolute bg-[#216869] rounded-lg mt-2 w-[80%] right-0 z-10 flex flex-col p-2 gap-2 text-[#F1F3F2]">
            {transactionType === "income" ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <button
                    className="py-1 px-2 rounded hover:bg-[#49A078] cursor-pointer text-left"
                    key={index}
                    onClick={() => {
                      setIncomeType("Salary");
                      setTypeIsOpen(false);
                    }}>
                    Salary
                  </button>
                ))}
              </>
            ) : (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <button
                    className="py-1 px-2 rounded hover:bg-[#49A078] cursor-pointer text-left"
                    key={index}
                    onClick={() => {
                      setExpenseType("Food");
                      setTypeIsOpen(false);
                    }}>
                    Food
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <InputField
        label="Price"
        type="number"
        placeholder="Enter amount"
        alignEnd
        wrapperClassName="bg-[#D7E8D9] w-full p-2 rounded-lg flex flex-col"
      />
      <InputField
        label="Description"
        type="text"
        placeholder="Enter description"
        alignEnd
        wrapperClassName="bg-[#D7E8D9] w-full p-2 rounded-lg flex flex-col"
      />
      <div className="bg-[#EAEDEB] w-full p-2 rounded-lg flex flex-col items-end">
        <p className="w-full">Date</p>
        <input
          type="date"
          className="rounded px-2 py-1 border-none appearance-none outline-none"
        />
      </div>
      <button className="bg-[#6DB393] text-white w-full py-2 cursor-pointer rounded-lg">
        Add Transaction
      </button>
    </div>
  );
};

export default AddTransaction;
