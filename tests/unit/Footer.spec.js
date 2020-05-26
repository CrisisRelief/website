import { shallowMount } from "@vue/test-utils";
import Footer from "../../src/components/Footer.vue";

const wrapper = shallowMount(Footer);

describe("Footer", () => {
    it("attempt to execute a test", () => {
        expect(true).toBe(true);
    });
})