import { shallowMount } from "@vue/test-utils";
import SearchBox from "../../src/components/SearchBox.vue";

const wrapper = shallowMount(SearchBox);

describe("SearchBox", () => {
    it("should match last snapshot", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
});