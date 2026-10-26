import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LeadershipWork } from "@/components/leadership-work";

describe("Leadership artwork exploration", () => {
  it("opens original artwork, wraps through the full case, and restores keyboard focus", async () => {
    const user = userEvent.setup();
    render(<LeadershipWork />);
    const trigger = screen.getByRole("button", { name: "Open Hot Wheels Gravity — racing concept in image viewer" });

    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/04/Hotwheels-Gravity-Race-scaled.png");

    await user.keyboard("{ArrowLeft}");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/04/Barbie-Fashion_04-scaled.png");
    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/04/Hotwheels-Gravity-Race-scaled.png");
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("keeps the expanded archive accessible and returns focus to its artwork", async () => {
    const user = userEvent.setup();
    render(<LeadershipWork />);
    expect(screen.queryByRole("button", { name: "Open Tales — mobile reading experience in image viewer" })).not.toBeInTheDocument();

    await user.click(screen.getByText("More Tales artwork & interfaces"));
    const trigger = await screen.findByRole("button", { name: "Open Tales — mobile reading experience in image viewer" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/03/IMG_1633-Copy.png");
    await user.click(within(dialog).getByRole("button", { name: "Close image viewer" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("retains collaborator credit in the original character pipeline view", async () => {
    const user = userEvent.setup();
    render(<LeadershipWork />);
    await user.click(screen.getByRole("button", { name: "Open Character development — sketch, concept, and game model in image viewer" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2015/08/monsters_character_pipeline.jpg");
    expect(dialog).toHaveAccessibleDescription(/Final concepts: Christian MacNevin\. 3D character models: Eric Maki\./);
  });

  it("supports swipe navigation without turning a tap into a slide change", async () => {
    const user = userEvent.setup();
    render(<LeadershipWork />);
    await user.click(screen.getByRole("button", { name: "Open Hot Wheels Gravity — racing concept in image viewer" }));
    const dialog = await screen.findByRole("dialog");
    const stage = within(dialog).getByRole("img").parentElement!;

    fireEvent.pointerDown(stage, { clientX: 200 });
    fireEvent.pointerUp(stage, { clientX: 185 });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/04/Hotwheels-Gravity-Race-scaled.png");
    fireEvent.pointerDown(stage, { clientX: 200 });
    fireEvent.pointerUp(stage, { clientX: 80 });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/assets/images/2025/04/Barbie-Royal-scaled.png");
  });

  it("loads video only on request and stops it when the archive closes", async () => {
    const user = userEvent.setup();
    const { container } = render(<LeadershipWork />);
    expect(container.querySelector("iframe")).not.toBeInTheDocument();

    const summary = screen.getByText("More Battlefield imagery & trailer");
    await user.click(summary);
    const play = await screen.findByRole("button", { name: "Play Battlefield Hardline trailer" });
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
    await user.click(play);
    expect(screen.getByTitle("Battlefield Hardline trailer")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/yWVPoUCxAC4?autoplay=1");

    await user.click(summary);
    await waitFor(() => expect(container.querySelector("iframe")).not.toBeInTheDocument());
  });
});
