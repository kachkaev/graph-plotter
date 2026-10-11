import { Trans, useTranslation } from "react-i18next";
import { styled } from "styled-components";

import { Nobr } from "../../essentials";
import type { InvalidPlotAreaConfig } from "../plot-area";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-direction: column;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const MainMessage = styled.div`
  font-weight: bold;
  color: #8d844c;
`;

const ErrorMessage = styled.div`
  max-width: 70%;
  padding-top: 20px;
  padding-bottom: 40px;
`;

export type PlotContentsWithInvalidAreaProps = {
  areaConfig: InvalidPlotAreaConfig;
};

export function PlotContentsWithInvalidArea({
  areaConfig,
}: PlotContentsWithInvalidAreaProps) {
  const { t } = useTranslation();
  const error = areaConfig.errors[0];

  return (
    <Wrapper>
      <MainMessage>{t("ui.cap_f_param_error")}</MainMessage>
      {error ? (
        <ErrorMessage>
          <Trans i18nKey={error.i18nKey} values={error.i18nValues}>
            <b />
            <Nobr />
          </Trans>
        </ErrorMessage>
      ) : undefined}
    </Wrapper>
  );
}
