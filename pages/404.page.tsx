import { NextPage } from "next";
import * as React from "react";

import { ErrorPageContents } from "../shared/error-page-contents";
import { PageMetadata } from "../shared/page-metadata";

const NotFoundPage: NextPage = () => {
  const message = "page not found";

  return (
    <>
      <PageMetadata title={message} description="" />
      <ErrorPageContents statusCode={404} message={message} />
    </>
  );
};

export default NotFoundPage;
