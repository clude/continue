import {
  ArrowPathIcon,
  BarsArrowDownIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChatHistoryItem } from "core";
import { stripImages } from "core/llm/images";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBackground,
  vscInputBackground,
} from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import useUIConfig from "../../hooks/useUIConfig";
import { RootState } from "../../redux/store";
import { getFontSize } from "../../util";
import ButtonWithTooltip from "../ButtonWithTooltip";
import { CopyButton } from "../markdown/CopyButton";
import StyledMarkdownPreview from "../markdown/StyledMarkdownPreview";
import i18n from 'i18next';
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();

interface StepContainerProps {
  item: ChatHistoryItem;
  onReverse: () => void;
  onUserInput: (input: string) => void;
  onRetry: () => void;
  onContinueGeneration: () => void;
  onDelete: () => void;
  open: boolean;
  isFirst: boolean;
  isLast: boolean;
  index: number;
  modelTitle?: string;
}

const ContentDiv = styled.div<{ isUserInput: boolean; fontSize?: number }>`
  padding: 4px 0px 8px 0px;
  background-color: ${(props) =>
    props.isUserInput ? vscInputBackground : vscBackground};
  font-size: ${(props) => props.fontSize || getFontSize()}px;
  // border-radius: ${defaultBorderRadius};
  overflow: hidden;
`;

function StepContainer(props: StepContainerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUserInput = props.item.message.role === "user";
  const active = useSelector((store: RootState) => store.state.active);
  const ideMessenger = useContext(IdeMessengerContext);

  const [feedback, setFeedback] = useState<boolean | undefined>(undefined);

  const sessionId = useSelector((store: RootState) => store.state.sessionId);

  const sendFeedback = (feedback: boolean) => {
    setFeedback(feedback);
    if (props.item.promptLogs?.length) {
      for (const promptLog of props.item.promptLogs) {
        ideMessenger.post("devdata/log", {
          tableName: "chat",
          data: { ...promptLog, feedback, sessionId },
        });
      }
    }
  };

  const [truncatedEarly, setTruncatedEarly] = useState(false);

  const uiConfig = useUIConfig();

  useEffect(() => {
    if (!active) {
      const content = stripImages(props.item.message.content).trim();
      const endingPunctuation = [".", "?", "!", "```"];

      // If not ending in punctuation or emoji, we assume the response got truncated
      if (
        !(
          endingPunctuation.some((p) => content.endsWith(p)) ||
          /\p{Emoji}/u.test(content.slice(-2))
        )
      ) {
        setTruncatedEarly(true);
      } else {
        setTruncatedEarly(false);
      }
    }
  }, [props.item.message.content, active]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative">
        <ContentDiv
          hidden={!props.open}
          isUserInput={isUserInput}
          fontSize={getFontSize()}
        >
          {uiConfig?.displayRawMarkdown ? (
            <pre
              className="whitespace-pre-wrap break-words p-4 max-w-full overflow-x-auto"
              style={{ fontSize: getFontSize() - 2 }}
            >
              {stripImages(props.item.message.content)}
            </pre>
          ) : (
            <StyledMarkdownPreview
              source={stripImages(props.item.message.content)}
              showCodeBorder={true}
            />
          )}
        </ContentDiv>
        {(props.isLast || isHovered || typeof feedback !== "undefined") &&
          !active && (
            <div
              className="flex items-center gap-1 absolute -bottom-2 right-2"
              style={{
                color: lightGray,
                fontSize: getFontSize() - 3,
              }}
            >
              {props.modelTitle && (
                <>
                  <div className="flex items-center">{props.modelTitle}</div>
                  <div
                    className="ml-2 mr-1"
                    style={{
                      width: "1px",
                      height: "20px",
                      backgroundColor: lightGray,
                    }}
                  ></div>
                </>
              )}

              {truncatedEarly && (
                <ButtonWithTooltip
                  tabIndex={-1}
                  text={i18n.t("Continue generation")}
                  onClick={(e) => {
                    props.onContinueGeneration();
                  }}
                >
                  <BarsArrowDownIcon
                    color={lightGray}
                    width="1.2em"
                    height="1.2em"
                  />
                </ButtonWithTooltip>
              )}

              <CopyButton
                tabIndex={-1}
                text={stripImages(props.item.message.content)}
                color={lightGray}
              />
              <ButtonWithTooltip
                tabIndex={-1}
                text={i18n.t("Regenerate")}
                onClick={(e) => {
                  props.onRetry();
                }}
              >
                <ArrowPathIcon color={lightGray} width="1.2em" height="1.2em" />
              </ButtonWithTooltip>
              {feedback === false || (
                <ButtonWithTooltip text={i18n.t("Helpful")} tabIndex={-1}>
                  <HandThumbUpIcon
                    width="1.2em"
                    height="1.2em"
                    color={lightGray}
                    onClick={() => {
                      sendFeedback(true);
                    }}
                  />
                </ButtonWithTooltip>
              )}
              {feedback === true || (
                <ButtonWithTooltip text={i18n.t("Unhelpful")} tabIndex={-1}>
                  <HandThumbDownIcon
                    width="1.2em"
                    height="1.2em"
                    color={lightGray}
                    onClick={() => {
                      sendFeedback(false);
                    }}
                  />
                </ButtonWithTooltip>
              )}
              <ButtonWithTooltip text={i18n.t("Delete")} tabIndex={-1}>
                <TrashIcon
                  color={lightGray}
                  width="1.2em"
                  height="1.2em"
                  onClick={() => {
                    props.onDelete();
                  }}
                />
              </ButtonWithTooltip>
            </div>
          )}
      </div>
    </div>
  );
}

export default StepContainer;
