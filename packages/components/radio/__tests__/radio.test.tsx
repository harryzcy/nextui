import type {UserEvent} from "@testing-library/user-event";
import type {RadioGroupProps} from "../src";

import * as React from "react";
import {act, render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Form} from "@heroui/form";

import {RadioGroup, Radio} from "../src";

describe("Radio", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should render correctly", () => {
    const wrapper = render(
      <RadioGroup label="Options">
        <Radio value="1">Option 1</Radio>
      </RadioGroup>,
    );

    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("ref should be forwarded - group", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <RadioGroup ref={ref} label="Options">
        <Radio value="1">Option 1</Radio>
      </RadioGroup>,
    );
    expect(ref.current).not.toBeNull();
  });

  it("ref should be forwarded - option", () => {
    const ref = React.createRef<HTMLLabelElement>();

    render(
      <RadioGroup label="Options">
        <Radio ref={ref} value="1">
          Option 1
        </Radio>
      </RadioGroup>,
    );
    expect(ref.current).not.toBeNull();
  });

  it("should work correctly with initial value", () => {
    let {container} = render(
      <RadioGroup label="Options" value="1">
        <Radio data-testid="radio-test-1" value="1">
          Option 1
        </Radio>
      </RadioGroup>,
    );

    expect(container.querySelector("[data-testid=radio-test-1] input")).toBeChecked();

    let wrapper = render(
      <RadioGroup defaultValue="2" label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio data-testid="radio-test-2" value="2">
          Option 1
        </Radio>
      </RadioGroup>,
    );

    expect(wrapper.container.querySelector("[data-testid=radio-test-2] input")).toBeChecked();
  });

  it("should change value after click", async () => {
    const {container} = render(
      <RadioGroup defaultValue="1" label="Options">
        <Radio value="1">Option 1</Radio>
        <Radio className="radio-test-2" value="2">
          Option 1
        </Radio>
      </RadioGroup>,
    );

    let radio2 = container.querySelector(".radio-test-2 input") as HTMLInputElement;

    await user.click(radio2);
    expect(radio2).toBeChecked();
  });

  it("should ignore events when disabled", async () => {
    const {container} = render(
      <RadioGroup label="Options">
        <Radio isDisabled className="radio-test-1" value="1">
          Option 1
        </Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    let radio1 = container.querySelector(".radio-test-1 input") as HTMLInputElement;

    await user.click(radio1);
    expect(radio1).not.toBeChecked();
  });

  it('should work correctly with "onValueChange" prop', async () => {
    const onValueChange = jest.fn();

    const {container} = render(
      <RadioGroup defaultValue="1" label="Options" onValueChange={onValueChange}>
        <Radio value="1">Option 1</Radio>
        <Radio className="radio-test-2" value="2">
          Option 2
        </Radio>
      </RadioGroup>,
    );

    let radio2 = container.querySelector(".radio-test-2 input") as HTMLInputElement;

    await user.click(radio2);
    expect(onValueChange).toHaveBeenCalledWith("2");

    expect(radio2).toBeChecked();
  });

  it('should work correctly with "onFocus" prop', () => {
    const onFocus = jest.fn();

    const {container} = render(
      <RadioGroup defaultValue="1" label="Options" onFocus={onFocus}>
        <Radio value="1">Option 1</Radio>
        <Radio className="radio-test-2" value="2">
          Option 2
        </Radio>
      </RadioGroup>,
    );

    let radio2 = container.querySelector(".radio-test-2 input") as HTMLInputElement;

    act(() => {
      radio2.focus();
    });

    expect(onFocus).toHaveBeenCalled();
  });

  it("should have required attribute when isRequired with native validationBehavior", () => {
    const {getByRole, getAllByRole} = render(
      <RadioGroup isRequired label="Options" validationBehavior="native">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    const group = getByRole("radiogroup");

    expect(group).toHaveAttribute("aria-required", "true");

    const radios = getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("required");
  });

  it("should not have required attribute when isRequired with aria validationBehavior", () => {
    const {getByRole, getAllByRole} = render(
      <RadioGroup isRequired label="Options" validationBehavior="aria">
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </RadioGroup>,
    );

    const group = getByRole("radiogroup");

    expect(group).toHaveAttribute("aria-required", "true");

    const radios = getAllByRole("radio");

    expect(radios[0]).not.toHaveAttribute("required");
  });

  it("should work correctly with controlled value", async () => {
    const onValueChange = jest.fn();

    const Component = ({onValueChange}: Omit<RadioGroupProps, "value">) => {
      const [value, setValue] = React.useState("1");

      return (
        <RadioGroup
          label="Options"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange?.(next as any);
          }}
        >
          <Radio value="1">Option 1</Radio>
          <Radio className="radio-test-2" value="2">
            Option 2
          </Radio>
        </RadioGroup>
      );
    };

    const {container} = render(<Component onValueChange={onValueChange} />);

    let radio2 = container.querySelector(".radio-test-2 input") as HTMLInputElement;

    await user.click(radio2);
    expect(onValueChange).toHaveBeenCalled();

    expect(radio2).toBeChecked();
  });

  it("should support help text description", () => {
    const {getByRole} = render(
      <RadioGroup description="Help text" label="Options">
        <Radio value="1">Option 1</Radio>
      </RadioGroup>,
    );

    const group = getByRole("radiogroup");

    expect(group).toHaveAttribute("aria-describedby");

    const groupDescriptionId = group.getAttribute("aria-describedby");
    const groupDescriptionElement = document.getElementById(groupDescriptionId as string);

    expect(groupDescriptionElement).toHaveTextContent("Help text");
  });

  it("should support help text description for the individual radios", () => {
    const {getByLabelText} = render(
      <RadioGroup description="Help text" label="Options">
        <Radio description="Help text for option 1" value="1">
          Option 1
        </Radio>
        <Radio description="Help text for option 2" value="2">
          Option 2
        </Radio>
      </RadioGroup>,
    );

    const option1 = getByLabelText("Option 1");

    expect(option1).toHaveAttribute("aria-describedby");
    const option1Description = option1
      .getAttribute("aria-describedby")
      ?.split(" ")
      .map((d) => document.getElementById(d)?.textContent)
      .join(" ");

    expect(option1Description).toBe("Help text for option 1 Help text");

    const option2 = getByLabelText("Option 2");
    const option2Description = option2
      .getAttribute("aria-describedby")
      ?.split(" ")
      .map((d) => document.getElementById(d)?.textContent)
      .join(" ");

    expect(option2Description).toBe("Help text for option 2 Help text");
  });
});

describe("validation", () => {
  let user = userEvent.setup();

  beforeAll(() => {
    user = userEvent.setup();
  });
  describe("validationBehavior=native", () => {
    it("supports isRequired", async () => {
      const {getAllByRole, getByRole, getByTestId} = render(
        <form data-testid="form">
          <RadioGroup isRequired aria-label="favorite pet" validationBehavior="native">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="dragons">Dragons</Radio>
          </RadioGroup>
        </form>,
      );

      const group = getByRole("radiogroup");

      expect(group).not.toHaveAttribute("aria-describedby");

      const radios = getAllByRole("radio") as HTMLInputElement[];

      for (let input of radios) {
        expect(input).toHaveAttribute("required");
        expect(input).not.toHaveAttribute("aria-required");
        expect(input.validity.valid).toBe(false);
      }

      act(() => {
        (getByTestId("form") as HTMLFormElement).checkValidity();
      });

      expect(group).toHaveAttribute("aria-describedby");
      expect(
        document.getElementById(group.getAttribute("aria-describedby") as string),
      ).toHaveTextContent("Constraints not satisfied");
      expect(document.activeElement).toBe(radios[0]);

      await user.click(radios[0]);
      for (let input of radios) {
        expect(input.validity.valid).toBe(true);
      }

      expect(group).not.toHaveAttribute("aria-describedby");
    });

    it("supports server validation", async () => {
      function Test() {
        const [serverErrors, setServerErrors] = React.useState({});
        const onSubmit = (e) => {
          e.preventDefault();
          setServerErrors({
            pet: "You must choose a pet.",
          });
        };

        return (
          <Form validationBehavior="native" validationErrors={serverErrors} onSubmit={onSubmit}>
            <RadioGroup aria-label="favorite pet" name="pet" validationBehavior="native">
              <Radio value="dogs">Dogs</Radio>
              <Radio value="cats">Cats</Radio>
              <Radio value="dragons">Dragons</Radio>
            </RadioGroup>
            <button type="submit">Submit</button>
          </Form>
        );
      }

      const {getAllByRole, getByRole} = render(<Test />);

      const group = getByRole("radiogroup");

      expect(group).not.toHaveAttribute("aria-describedby");

      await user.click(getByRole("button"));

      expect(group).toHaveAttribute("aria-describedby");
      expect(document.getElementById(group.getAttribute("aria-describedby")!)).toHaveTextContent(
        "You must choose a pet.",
      );

      const radios = getAllByRole("radio") as HTMLInputElement[];

      for (const input of radios) {
        expect(input.validity.valid).toBe(false);
      }

      await user.click(radios[0]);
      expect(group).not.toHaveAttribute("aria-describedby");
      for (const input of radios) {
        expect(input.validity.valid).toBe(true);
      }
    });
  });

  describe("validationBehavior=aria", () => {
    it("supports validate function", async () => {
      const {getAllByRole, getByRole} = render(
        <RadioGroup
          aria-label="favorite pet"
          defaultValue="dragons"
          validate={(v) => (v === "dragons" ? "Too scary" : null)}
          validationBehavior="aria"
        >
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>,
      );

      const group = getByRole("radiogroup");

      expect(group).toHaveAttribute("aria-describedby");
      expect(group).toHaveAttribute("aria-invalid", "true");
      expect(
        document.getElementById(group.getAttribute("aria-describedby") as string),
      ).toHaveTextContent("Too scary");

      const radios = getAllByRole("radio") as HTMLInputElement[];

      for (let input of radios) {
        expect(input.validity.valid).toBe(true);
      }

      await user.click(radios[0]);
      expect(group).not.toHaveAttribute("aria-describedby");
      expect(group).not.toHaveAttribute("aria-invalid");
    });

    it("supports server validation", async () => {
      const {getAllByRole, getByRole} = render(
        <Form validationBehavior="aria" validationErrors={{pet: "You must choose a pet"}}>
          <RadioGroup aria-label="favorite pet" name="pet">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="dragons">Dragons</Radio>
          </RadioGroup>
        </Form>,
      );

      const group = getByRole("radiogroup");

      expect(group).toHaveAttribute("aria-describedby");
      expect(group).toHaveAttribute("aria-invalid", "true");
      expect(document.getElementById(group.getAttribute("aria-describedby")!)).toHaveTextContent(
        "You must choose a pet",
      );

      const radios = getAllByRole("radio");

      await user.click(radios[0]);
      expect(group).not.toHaveAttribute("aria-describedby");
      expect(group).not.toHaveAttribute("aria-invalid");
    });
  });
});
