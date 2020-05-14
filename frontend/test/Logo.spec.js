import { mount } from '@vue/test-utils'
import Logo from '../components/Logo.vue'

describe('Logo', () => {
  const wrapper = mount(Logo)

  test('is a Vue instance', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
