import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import KiboImage from './KiboImage'
import Logo from '@/public/icons/clothLogo.jpg'

export default {
  title: 'Common/KiboImage',
  component: KiboImage,
} as ComponentMeta<typeof KiboImage>

const Template: ComponentStory<typeof KiboImage> = (args) => <KiboImage {...args} />

export const Common = Template.bind({})
Common.args = {
  src: Logo,
  alt: 'test-alt-text',
  width: '100',
  height: '100',
}
