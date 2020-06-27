import React from "react";

import { PageContentsForApp } from "../ui/PageContentsForApp";
import { PageMetadata } from "../ui/PageMetadata";

const IndexPage = () => {
  return (
    <>
      <PageMetadata />
      <PageContentsForApp />
    </>
  );
};

export default IndexPage;
