import type { NextPageContext } from "next";

import { ErrorPageContents } from "../shared/error-page-contents";
import { PageMetadata } from "../shared/page-metadata";

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  const message = "unknown error";

  return (
    <>
      <PageMetadata title={message} description="" />
      <ErrorPageContents statusCode={statusCode} message={message} />
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : (err?.statusCode ?? 500);

  return { statusCode };
};
