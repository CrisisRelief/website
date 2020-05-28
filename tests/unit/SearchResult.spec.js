import { shallowMount } from "@vue/test-utils";
import SearchResult from "../../src/components/SearchResult.vue";

const wrapper = shallowMount(SearchResult);

describe("SearchResult", () => {
    it("should match last snapshot", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
});