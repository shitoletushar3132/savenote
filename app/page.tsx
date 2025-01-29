// Home Component
"use client";
import AddNote from "@/components/AddNote";
import Header from "@/components/Header";
import Notepage from "./notepage";
import { useState } from "react";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  return (
    <div className="flex flex-col">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="p-4">
        <AddNote refreshData={setRefreshData} />
      </div>
      <div>
        <Notepage searchValue={searchValue} refresh={refreshData} />
      </div>
    </div>
  );
}
