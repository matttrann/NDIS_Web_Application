"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Questionnaire } from "@/components/admin/questionnaire-columns";

interface QuestionnaireResultsTableProps {
  data: Questionnaire[];
  columns: ColumnDef<Questionnaire>[];
}

export function QuestionnaireResultsTable({ data, columns }: QuestionnaireResultsTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("id"); // Default filter type

  const filteredData = data.filter((item) => {
    const searchTerm = filterValue.toLowerCase();
    switch (filterType) {
      case "id":
        return item.id.toLowerCase().includes(searchTerm);
      case "user":
        return item.user.name?.toLowerCase().includes(searchTerm) || 
               item.user.email.toLowerCase().includes(searchTerm);
      case "answers":
        return JSON.stringify(item.answers).toLowerCase().includes(searchTerm);
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={filterType}
          onValueChange={setFilterType}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">Questionnaire ID</SelectItem>
            <SelectItem value="user">User Name/Email</SelectItem>
            <SelectItem value="answers">Answers Content</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder={`Search by ${filterType}...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData}
      />
    </div>
  );
} 