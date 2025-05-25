"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Category } from "@/generated/prisma";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface Props {
  type: TransactionType;
}

function CategoryPicker({ type }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const categories = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categories.data?.find(
    (category: Category) => category.name === value
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-[200px] justify-between"
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
        ></Button>
      </PopoverTrigger>
    </Popover>
  );
}

export default CategoryPicker;
