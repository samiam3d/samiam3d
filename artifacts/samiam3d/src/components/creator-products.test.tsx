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
import { mindinkViews } from "@/lib/mindink-showcase";

const expectedProjects = [
  {
    id: "mindink",
    name: "MindInk",
    brandAsset: "mindink-mark.webp",
  },
  {
    id: "vibemind",
    name: "VibeMind",
    brandAsset: "vibemind-mark.webp",
  },
  {
    id: "flower-musica",
    name: "Flower Musica",
    brandAsset: "flower-musica-mark.webp",
  },
  {
    id: "hotclips",
    name: "HotClips",
    brandAsset: "hotclips-mark.webp",
  },
  {
    id: "trendink",
    name: "TrendInk",
    brandAsset: "trendink-icon.png",
  },
  {
    id: "clauseink",
    name: "ClauseInk",
    brandAsset: "clauseink-wordmark-dark.png",
  },
] as const;

const renderProductLab = () => render(<CreatorProducts />);

const projectButton = (name: string) =>
  screen.getByRole("button", {
    name: `Explore the project: ${name}`,
  });

const openProject = async (name: string, user = userEvent.setup()) => {
  const trigger = projectButton(name);
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog");

  return { dialog, trigger, user };
};

describe("Project showcases", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/#creator-products");
  });

  it("gives each project its own named section, authentic identity, and index link", () => {
    renderProductLab();
    const collection = screen.getByRole("region", { name: "My own projects." });
    const sections = within(collection).getAllByRole("region");
    const index = within(collection).getByRole("navigation", {
      name: "Explore my projects",
    });
    expect(sections).toHaveLength(6);
    expect(within(index).getAllByRole("link")).toHaveLength(6);
    expect(
      screen.getAllByRole("button", { name: /Explore the project: / }),
    ).toHaveLength(6);

    expectedProjects.forEach(({ id, name, brandAsset }) => {
      const link = within(index).getByRole("link", { name });
      expect(link).toHaveAttribute("href", `#project-${id}`);
      const section = document.getElementById(`project-${id}`)!;
      expect(sections).toContain(section);
      expect(section).toHaveAccessibleName();
      expect(within(section).getByRole("heading", { level: 3 })).toBeVisible();
      expect(
        within(section).getByRole("img", { name, exact: true }),
      ).toBeVisible();
      expect(
        section.querySelector(`img[src="/assets/brands/${brandAsset}"]`),
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("button", {
          name: `Explore the project: ${name}`,
        }),
      ).toHaveAttribute("aria-haspopup", "dialog");
    });
  });

  it("identifies the VibeMind demo workspace and original Flower identity", () => {
    renderProductLab();

    expect(
      screen.getByRole("img", {
        name: /VibeMind private alpha.*demo workspace/i,
      }),
    ).toBeVisible();
    expect(screen.getByText("Private alpha · Demo workspace")).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: /Flower Musica's original lightning-eyed flower identity/i,
      }),
    ).toBeVisible();
  });

  it("switches all four MindInk views by click and keyboard without opening a project or changing history", async () => {
    const user = userEvent.setup();
    renderProductLab();
    const switcher = screen.getByRole("group", { name: "MindInk views" });
    const controls = within(switcher).getAllByRole("button");
    const initialUrl = window.location.href;
    const initialHistoryLength = window.history.length;
    const initialHistoryState = window.history.state;

    expect(controls).toHaveLength(4);
    ["Branch Canvas", "Scene Editor", "Stories", "Movie Creator"].forEach(
      (label, index) => expect(controls[index]).toHaveAccessibleName(label),
    );

    const expectView = (id: (typeof mindinkViews)[number]["id"]) => {
      const view = mindinkViews.find((item) => item.id === id)!;
      const figure = screen.getByRole("figure", { name: view.label });
      expect(figure).toBeVisible();
      expect(within(figure).getByRole("img", { name: view.alt })).toHaveAttribute(
        "src",
        `/assets/showcase/mindink-v2/${id}.webp`,
      );
      expect(within(figure).getByRole("heading", { name: view.headline })).toBeVisible();
      expect(within(figure).getByText(view.description)).toBeVisible();
      expect(within(figure).getByText("Product visualization")).toBeVisible();

      mindinkViews.forEach((item) => {
        const selected = item.id === id;
        expect(within(switcher).getByRole("button", { name: item.label }))
          .toHaveAttribute("aria-pressed", String(selected));
        if (!selected) {
          expect(screen.queryByRole("img", { name: item.alt })).not.toBeInTheDocument();
        }
      });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(window.location.href).toBe(initialUrl);
      expect(window.history.length).toBe(initialHistoryLength);
      expect(window.history.state).toEqual(initialHistoryState);
    };

    expectView("branch-canvas");

    const editor = within(switcher).getByRole("button", { name: "Scene Editor" });
    editor.focus();
    await user.keyboard("{Enter}");
    expectView("scene-editor");
    expect(editor).toHaveFocus();

    await user.click(within(switcher).getByRole("button", { name: "Stories" }));
    expectView("stories");

    const movie = within(switcher).getByRole("button", { name: "Movie Creator" });
    movie.focus();
    await user.keyboard(" ");
    expectView("movie-creator");
    expect(movie).toHaveFocus();

    await user.click(within(switcher).getByRole("button", { name: "Branch Canvas" }));
    expectView("branch-canvas");
  });

  it.each(expectedProjects)(
    "opens $name details from its section and writes the project URL",
    async ({ id, name }) => {
      renderProductLab();
      const { dialog } = await openProject(name);
      const project = creatorProjects.find((item) => item.id === id)!;

      expect(
        within(dialog).getByRole("heading", {
          name: project.modalHeadline,
        }),
      ).toBeVisible();
      expect(
        within(dialog).getByRole("img", { name, exact: true }),
      ).toBeVisible();
      expect(window.location.search).toBe(`?project=${id}`);
      expect(document.documentElement).toHaveClass("has-project-modal-open");
    },
  );

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
        name: "Next project, VibeMind",
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "Creative intent in. Owned software out.",
        }),
      ).toBeVisible(),
    );
    expect(window.location.search).toBe("?project=vibemind");

    await user.click(
      screen.getByRole("button", {
        name: "Previous project, MindInk",
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "A complete creative studio for stories, worlds, movies, and publishing.",
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

  it("consumes the modal history entry when dismissed and reopens on Forward", async () => {
    renderProductLab();
    const { user } = await openProject("MindInk");
    const historyLength = window.history.length;

    await user.click(
      screen.getByRole("button", { name: "Close MindInk project details" }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(window.location.search).toBe("");
    expect(window.history.length).toBe(historyLength);

    act(() => window.history.forward());
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", {
        name: "A complete creative studio for stories, worlds, movies, and publishing.",
      }),
    ).toBeVisible();
    expect(window.location.search).toBe("?project=mindink");
  });

  it("closes with Escape and restores focus to the action that opened it", async () => {
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
});
