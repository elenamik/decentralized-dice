import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

jest.mock("react-query", () => ({
  useQuery: jest.fn().mockReturnValue({
    data: {
      user_info: {
        date_of_birth: "1986-04-10",
        household_income: 551479,
        current_savings_rate: 22,
        current_retirement_savings: 23195,
        full_name: "Michael Hamilton",
        address: "08388 Felicia Square\nNorth Christopher, NM 39143",
      },
      assumptions: {
        pre_retirement_income_percent: 81,
        life_expectancy: 78,
        expected_rate_of_return: 7,
        retirement_age: 63,
      },
    },
    isLoading: false,
    error: undefined,
  }),
}));

describe("SocialSecurityCard", () => {
  afterEach(() => {
    fetch.mockClear();
    // cleaning up the mess left behind the previous test
  });

  it("calls API for userId and displays data", async () => {
    // render(<SocialSecurityCard userId={5} graphUrl="/mock-url" />);
    // await screen.findByText("63");
    // fireEvent.click(screen.getByText("Choose..."));
    // fireEvent.click(await screen.findByText("Michael Hamilton"));
    // screen.findByText("Michael Hamilton");
    // TODO: test for other text on screen
  });
});
