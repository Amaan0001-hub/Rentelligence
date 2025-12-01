"use client";

import DownlineMemberNode from "./downline-member-node/page";
import { NftSection } from "@/app/components/NftSection";
import { usePathname } from "next/navigation";
import { getPageName } from "@/app/utils/utils";

export default function TeamGrowthMatrix() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  return (
    <>
      <NftSection pageName={pageName} />
      <div className="px-6">
        <DownlineMemberNode />
      </div>
    </>
  );
}
