import { shallowMount } from "@vue/test-utils";
import Footer from "../../src/components/Footer.vue";

const wrapper = shallowMount(Footer);

describe("Footer", () => {
    it("should match last snapshot", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
    it("should render correct social links and icons", () => {
      const socialData = Footer.data().socials;
      const elements = wrapper.findAll('#socials span a');

      socialData.forEach((item, index) => {
        const element = elements.at(index);

        expect(element.attributes().aria).toBe(item.alt);
        expect(element.attributes().href).toBe(item.link);
  
        const icon = element.find("i");

        expect(icon.classes(item.icon)).toBe(true);
        
      });
    });
});