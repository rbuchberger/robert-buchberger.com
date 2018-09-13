require "svg_optimizer"

module BatchOptimizer

  def self.batch

    Dir.glob("*.svg").each do |svg|
      SvgOptimizer.optimize_file(svg, "optimized/" + svg )
    end

    puts "success!"

  end

end
