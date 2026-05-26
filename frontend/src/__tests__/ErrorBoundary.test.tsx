import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ErrorBoundary from "../components/ErrorBoundary";

function Bomb(): never {
  throw new Error("💥");
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <p>Hello</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("catches errors and shows fallback", () => {
    const original = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("💥")).toBeInTheDocument();
    expect(screen.getByText("Reload Page")).toBeInTheDocument();

    console.error = original;
  });
});
