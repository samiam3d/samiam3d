import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CreatorProducts } from "@/components/creator-products";
import { creatorProjects } from "@/lib/creator-projects";

const expectedCardCopy = [
  {
    name: "MindInk",
    headline: "Direct stories like a studio.",
    description:
      "A connected story studio for building characters, branching narratives, cinematic scenes, and entire worlds.",
  },
  {
    name: "ClauseInk",
    headline: "Draft contracts without fighting the document.",
    description:
      "A legal workspace for drafting, reviewing, redlining, collaborating, and exporting polished agreements.",
  },
  {
    name: "HotClips",
    headline: "Find the moments worth publishing.",
    description:
      "A creator-directed workflow that turns full podcast episodes into reviewed, trimmed, ready-to-post clips.",
  },
  {
    name: "TrendInk",
    headline: "Find the signal. Build the story.",
    description:
      "A creator-led system that carries live trends and their source evidence from discovery through production.",
  },
] as const;

const renderProductLab = () => render(<CreatorProducts />);

const projectButton = (name: string) =>
  screen.getByRole("button", {
    name: `View ${name} project details`,
  });

const openProject = async (name: string, user = userEvent.setup()) => {
  const trigger = projectButton(name);
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog");

  return { dialog, trigger, user };
};

describe("Independent Product Lab", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/#creator-products");
  });

  it("renders the supplied introduction and all four product cards without direct external links", () => {
    renderProductLab();

    expect(
      screen.getByRole("heading", {
        name: "I build the products I wish existed.",
      }),
    ).toBeVisible();
    expect(screen.getByText("Independent Product Lab")).toBeVisible();
    expect(
      screen.getByText(
        "Four independent products conceived, designed, and shipped end to end—across storytelling, legal workflows, creator intelligence, and media. Each began as a problem I couldn’t ignore and became working software you can open today.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Product strategy · UX/UI · AI systems · Full-stack build · Brand · Launch",
      ),
    ).toBeVisible();

    expect(
      screen.getAllByRole("button", { name: /View .* project details/ }),
    ).toHaveLength(4);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    expectedCardCopy.forEach(({ name, headline, description }) => {
      expect(projectButton(name)).toBeVisible();
      expect(screen.getByText(headline)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
    });
  });

  it("opens a project dialog from a full-card click and writes the project URL", async () => {
    renderProductLab();
    const { dialog } = await openProject("MindInk");

    expect(
      within(dialog).getByRole("heading", {
        name: "A studio pipeline for independent storytellers.",
      }),
    ).toBeVisible();
    expect(window.location.search).toBe("?project=mindink");
    expect(document.documentElement).toHaveClass("has-project-modal-open");
  });

  it("opens a project dialog with the keyboard", async () => {
    const user = userEvent.setup();
    renderProductLab();

    const trigger = projectButton("ClauseInk");
    trigger.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", {
        name: "Legal drafting designed around the work—not around Word.",
      }),
    ).toBeVisible();
    expect(window.location.search).toBe("?project=clauseink");
  });

  it("opens the matching project from a direct project query", async () => {
    window.history.replaceState({}, "", "/?project=hotclips#creator-products");
    renderProductLab();

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", {
        name: "The system finds the moments. The creator makes the cut.",
      }),
    ).toBeVisible();
    expect(window.location.search).toBe("?project=hotclips");
  });

  it("moves between previous and next projects while keeping the URL current", async () => {
    renderProductLab();
    const { dialog, user } = await openProject("MindInk");

    await user.click(
      within(dialog).getByRole("button", {
        name: "Next project, ClauseInk",
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "Legal drafting designed around the work—not around Word.",
        }),
      ).toBeVisible(),
    );
    expect(window.location.search).toBe("?project=clauseink");

    await user.click(
      screen.getByRole("button", {
        name: "Previous project, MindInk",
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "A studio pipeline for independent storytellers.",
        }),
      ).toBeVisible(),
    );
    expect(window.location.search).toBe("?project=mindink");
  });

  it("reacts to browser Back and a popstate by closing the dialog", async () => {
    renderProductLab();
    await openProject("TrendInk");

    window.history.replaceState(
      { creatorProjectLab: false },
      "",
      "/#creator-products",
    );
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(window.location.search).toBe("");
  });

  it("closes with Escape and restores focus to the card that opened it", async () => {
    renderProductLab();
    const { trigger } = await openProject("MindInk");

    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "Close MindInk project details",
        }),
      ).toHaveFocus(),
    );

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes when the backdrop is pressed", async () => {
    renderProductLab();
    await openProject("ClauseInk");

    const backdrop = document.querySelector(".project-modal-backdrop");
    expect(backdrop).not.toBeNull();
    fireEvent.pointerDown(backdrop!);
    fireEvent.pointerUp(backdrop!);
    fireEvent.click(backdrop!);

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("keeps the external CTA scoped to the dialog and safe in a new tab", async () => {
    renderProductLab();
    const { dialog } = await openProject("MindInk");

    const cta = within(dialog).getByRole("link", {
      name: "Enter MindInk, opens MindInk in a new tab",
    });
    expect(cta).toHaveAttribute("href", "https://mindink.ai/");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supplies meaningful alt text for every project logo and modal visual", () => {
    creatorProjects.forEach((project) => {
      expect(project.logo.alt.trim()).not.toBe("");
      project.media.forEach((media) => {
        expect(media.alt.trim()).not.toBe("");
      });
    });
  });
});
