import { NextPage } from "next";
import * as React from "react";

import { ErrorPageContents } from "../shared/error-page-contents";
import { PageMetadata } from "../shared/page-metadata";

const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  const message = "unknown error";

  return (
    <>
      <PageMetadata title={message} description="" />
      <ErrorPageContents statusCode={statusCode} message={message} />
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err?.statusCode || 500;

  return { statusCode };
};

export default ErrorPage;
