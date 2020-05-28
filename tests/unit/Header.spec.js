import { shallowMount } from "@vue/test-utils";
import Header from "../../src/components/Header.vue";

const wrapper = shallowMount(Header);

describe("Header", () => {
    it("should match last snapshot", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
});