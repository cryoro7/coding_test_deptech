"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableAdmin from "@/components/Tables/TableAdmin";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const DataAdminPages = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    console.log(accessToken);
    if (!accessToken) {
      router.push("/auth/signin");
    }
  }, [router]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Admin" />

      <div className="flex flex-col gap-10">
        <TableAdmin />
      </div>
    </DefaultLayout>
  );
};

export default DataAdminPages;
