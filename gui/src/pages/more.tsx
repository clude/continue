import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { IndexingProgressUpdate } from "core";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lightGray, SecondaryButton, vscBackground } from "../components";
import KeyboardShortcutsDialog from "../components/dialogs/KeyboardShortcuts";
import IndexingProgressBar from "../components/loaders/IndexingProgressBar";
import { IdeMessengerContext } from "../context/IdeMessenger";
import { useNavigationListener } from "../hooks/useNavigationListener";
import { useWebviewListener } from "../hooks/useWebviewListener";
import { useDispatch } from "react-redux";
import { setOnboardingCard } from "../redux/slices/uiStateSlice";
import useHistory from "../hooks/useHistory";
import i18n from 'i18next';

interface MoreActionRowProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  href?: string;
}

function MoreActionRow({
  title,
  description,
  buttonText,
  onClick,
  href,
}: MoreActionRowProps) {
  const ButtonOrLink = href ? "a" : "div";
  const buttonProps = href
    ? { href, target: "_blank", className: "no-underline w-1/2" }
    : { className: "w-1/2" };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="w-1/2 pr-4">
        <h3 className="my-0">{title}</h3>
        <p>{description}</p>
      </div>
      <ButtonOrLink {...buttonProps}>
        <SecondaryButton
          className="grid grid-flow-col items-center gap-2 w-full"
          onClick={onClick}
        >
          {buttonText}
        </SecondaryButton>
      </ButtonOrLink>
    </div>
  );
}

function MorePage() {
  useNavigationListener();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ideMessenger = useContext(IdeMessengerContext);
  const { saveSession } = useHistory(dispatch);

  const [indexingState, setIndexingState] = useState<IndexingProgressUpdate>({
    desc: "Loading indexing config",
    progress: 0.0,
    status: "loading",
  });

  useWebviewListener("indexProgress", async (data) => {
    setIndexingState(data);
  });

  return (
    <div className="overflow-y-scroll overflow-x-hidden">
      <div
        className="items-center flex m-0 p-0 sticky top-0"
        style={{
          borderBottom: `0.5px solid ${lightGray}`,
          backgroundColor: vscBackground,
        }}
      >
        <ArrowLeftIcon
          width="1.2em"
          height="1.2em"
          onClick={() => navigate("/")}
          className="inline-block ml-4 cursor-pointer"
        />
        <h3 className="text-lg font-bold m-2 inline-block">{i18n.t("More")}</h3>
      </div>

      <h3 className="my-3 mx-auto text-center">{i18n.t("Codebase Indexing")}</h3>
      <div
        className="p-6 pb-0 flex flex-col gap-6"
        style={{
          borderTop: `0.5px solid ${lightGray}`,
        }}
      >
        <IndexingProgressBar indexingState={indexingState} />
      </div>

      <h3
        className="mb-3 mx-auto text-center py-3"
        style={{
          borderTop: `0.5px solid ${lightGray}`,
          borderBottom: `0.5px solid ${lightGray}`,
        }}
      >
        {i18n.t("Help Center")}
      </h3>
      <div className="p-6 flex flex-col gap-6">
        <MoreActionRow
          title={i18n.t("Documentation")}
          description={i18n.t("Visit the documentation site to learn how to configure and use Continue")}
          buttonText={i18n.t("View docs")}
          href="https://mate-ai.ouyeel.com/docs"
        />

        <MoreActionRow
          title={i18n.t("Quickstart")}
          description={i18n.t("Reopen the quickstart and tutorial file")}
          buttonText={i18n.t("Open quickstart")}
          onClick={() => {
            navigate("/");
            // Used to clear the chat panel before showing onboarding card
            saveSession();
            dispatch(setOnboardingCard({ show: true, activeTab: "Best" }));
            ideMessenger.post("showTutorial", undefined);
          }}
        />

        <MoreActionRow
          title={i18n.t("Token usage stats")}
          description={i18n.t("See how many tokens you're using each day and how they're distributed across your models")}
          buttonText={i18n.t("View token usage")}
          onClick={() => navigate("/stats")}
        />

        <MoreActionRow
          title={i18n.t("Have an issue?")}
          description={i18n.t("Let us know on GitHub and we'll do our best to resolve it")}
          buttonText={i18n.t("Create a GitHub issue")}
          href="https://github.com/continuedev/continue/issues/new/choose"
        />

        <MoreActionRow
          title={i18n.t("Join the community!")}
          description={i18n.t("Join us on Discord to stay up-to-date on the latest developments")}
          buttonText={i18n.t("Continue Discord")}
          href="https://discord.gg/vapESyrFmJ"
        />
      </div>

      <h3
        className="my-3 mx-auto text-center py-3"
        style={{
          borderTop: `0.5px solid ${lightGray}`,
          borderBottom: `0.5px solid ${lightGray}`,
        }}
      >
        {i18n.t("Keyboard Shortcuts")}
      </h3>
      <KeyboardShortcutsDialog />
    </div>
  );
}

export default MorePage;
