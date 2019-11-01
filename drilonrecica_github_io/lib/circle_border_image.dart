import 'package:flutter/material.dart';

class CircleBorderImage extends StatelessWidget {
  final double width;
  final double height;
  final double borderSize;
  final Color circleColor;
  final Widget image;

  const CircleBorderImage(
      {@required this.width,
      @required this.height,
      @required this.borderSize,
      @required this.circleColor,
      @required this.image,
      Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.transparent,
        shape: BoxShape.circle,
        border: Border.all(
          color: circleColor,
          width: borderSize,
        ),
      ),
      child: Center(
        child: image,
      ),
    );
  }
}
