import ReactDOM from "react-dom";
import styled from "styled-components";
import { defaultBorderRadius, lightGray, vscForeground } from "..";
import { getPlatform, isJetBrains } from "../../util";
import { ToolTip } from "../gui/Tooltip";
import i18n from 'i18next';
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();

const GridDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 2rem;
  padding: 1rem;
  justify-items: center;
  align-items: center;
`;

const StyledKeyDiv = styled.div`
  border: 0.5px solid ${lightGray};
  border-radius: ${defaultBorderRadius};
  padding: 4px;
  color: ${vscForeground};

  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const keyToName: { [key: string]: string } = {
  "⌘": "Cmd",
  "⌃": "Ctrl",
  "⇧": "Shift",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⌥": "Option",
  "⎇": "Alt",
};

function KeyDiv({ text }: { text: string }) {
  const tooltipPortalDiv = document.getElementById("tooltip-portal-div");

  return (
    <>
      <StyledKeyDiv data-tooltip-id={`header_button_${text}`}>
        {text}
      </StyledKeyDiv>
      {tooltipPortalDiv &&
        ReactDOM.createPortal(
          <ToolTip id={`header_button_${text}`} place="bottom">
            {keyToName[text]}
          </ToolTip>,
          tooltipPortalDiv,
        )}
    </>
  );
}

interface KeyboardShortcutProps {
  mac: string;
  windows: string;
  description: string;
}

function KeyboardShortcut(props: KeyboardShortcutProps) {
  const shortcut = getPlatform() === "mac" ? props.mac : props.windows;
  return (
    <div className="flex justify-between w-full items-center">
      <span
        style={{
          color: vscForeground,
        }}
      >
        {props.description}
      </span>
      <div className="flex gap-2 float-right">
        {shortcut.split(" ").map((key, i) => {
          return <KeyDiv key={i} text={key}></KeyDiv>;
        })}
      </div>
    </div>
  );
}

const vscodeShortcuts: KeyboardShortcutProps[] = [
  {
    mac: "⌘ L",
    windows: "⌃ L",
    description: i18n.t("Select Code + New Session"),
  },
  {
    mac: "⌘ I",
    windows: "⌃ I",
    description: i18n.t("Edit highlighted code"),
  },
  {
    mac: "⌘ ⇧ L",
    windows: "⌃ ⇧ L",
    description: i18n.t("Select Code"),
  },
  {
    mac: "⌘ ⇧ ⏎",
    windows: "⌃ ⇧ ⏎",
    description: i18n.t("Accept Diff"),
  },
  {
    mac: "⌘ ⇧ ⌫",
    windows: "⌃ ⇧ ⌫",
    description: i18n.t("Reject Diff"),
  },
  {
    mac: "⌥ ⌘ Y",
    windows: "Alt ⌃ Y",
    description: i18n.t("Accept Top Change in Diff"),
  },
  {
    mac: "⌥ ⌘ N",
    windows: "Alt ⌃ N",
    description: i18n.t("Reject Top Change in Diff"),
  },
  {
    mac: "⌥ ⌘ L",
    windows: "Alt ⌃ L",
    description: i18n.t("Toggle Continue Sidebar"),
  },
  {
    mac: "⌘ ⇧ R",
    windows: "⌃ ⇧ R",
    description: i18n.t("Debug Terminal"),
  },
  {
    mac: "⌘ ⌫",
    windows: "⌃ ⌫",
    description: i18n.t("Cancel response"),
  },
  {
    mac: "⌘ K ⌘ M",
    windows: "⌃ K ⌃ M",
    description: i18n.t("Toggle Full Screen"),
  },
  {
    mac: "⌘ '",
    windows: "⌃ '",
    description: i18n.t("Toggle Selected Model"),
  },
];

const jetbrainsShortcuts: KeyboardShortcutProps[] = [
  {
    mac: "⌘ J",
    windows: "⌃ J",
    description: i18n.t("Select Code + New Session"),
  },
  {
    mac: "⌘ ⇧ J",
    windows: "⌃ ⇧ J",
    description: i18n.t("Select Code"),
  },
  {
    mac: "⌘ I",
    windows: "⌃ I",
    description: i18n.t("Edit highlighted code"),
  },
  {
    mac: "⌘ ⇧ I",
    windows: "⌃ ⇧ I",
    description: i18n.t("Toggle inline edit focus"),
  },
  {
    mac: "⌘ ⇧ ⏎",
    windows: "⌃ ⇧ ⏎",
    description: i18n.t("Accept Diff"),
  },
  {
    mac: "⌘ ⇧ ⌫",
    windows: "⌃ ⇧ ⌫",
    description: i18n.t("Reject Diff"),
  },
  {
    mac: "⌥ ⇧ J",
    windows: "Alt ⇧ J",
    description: i18n.t("Quick Input"),
  },
  {
    mac: "⌥ ⌘ J",
    windows: "Alt ⌃ J",
    description: i18n.t("Toggle Sidebar"),
  },
  {
    mac: "⌘ ⌫",
    windows: "⌃ ⌫",
    description: i18n.t("Cancel response"),
  },
  {
    mac: "⌘ '",
    windows: "⌃ '",
    description: i18n.t("Toggle Selected Model"),
  },
];

function KeyboardShortcutsDialog() {
  return (
    <GridDiv>
      {(isJetBrains() ? jetbrainsShortcuts : vscodeShortcuts).map(
        (shortcut, i) => {
          return (
            <KeyboardShortcut
              key={i}
              mac={shortcut.mac}
              windows={shortcut.windows}
              description={shortcut.description}
            />
          );
        },
      )}
    </GridDiv>
  );
}

export default KeyboardShortcutsDialog;
