import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  const ResponsiveLayout({
    Key key,
    @required this.largeChild,
    this.mediumChild,
    this.smallChild,
  })  : assert(largeChild != null),
        super(key: key);

  final Widget largeChild;
  final Widget mediumChild;
  final Widget smallChild;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.of(context).size.width > 1200) {
      return largeChild;
    } else if (MediaQuery.of(context).size.width < 800) {
      return smallChild;
    } else {
      return mediumChild;
    }
  }
}
