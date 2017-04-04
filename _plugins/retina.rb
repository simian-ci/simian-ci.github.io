require 'rake/pathmap'

module Jekyll
  module Retina
    ##
    # Generates srcset attribute
    # - This assumes image is on /images/ folder
    # - This assume convention for image naming on 2x and 3x
    # Example:
    #   "path.jpg" | generate_srcset
    #   => "/images/path.jpg 1x, /images/path@2x.jpg 2x, /images/path@3x.jpg 3x"
    def generate_srcset(url)
      resolutions = {'1x' => '', '2x' => '@2x', '3x' => '@3x'}
      resolutions.keys
        .map { |res| url.pathmap "/images/%X#{resolutions[res]}%x #{res}" }
        .join(", ")
    end
  end
end

Liquid::Template.register_filter(Jekyll::Retina)
