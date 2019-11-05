import 'package:flutter/material.dart';

class ResponsiveLayout extends StatefulWidget {
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
  _ResponsiveLayoutState createState() => _ResponsiveLayoutState();
}

class _ResponsiveLayoutState extends State<ResponsiveLayout> {
  @override
  Widget build(BuildContext context) {
    if (MediaQuery.of(context).size.width > 1200) {
      return widget.largeChild;
    } else if (MediaQuery.of(context).size.width < 800) {
      if (widget.smallChild == null) {
        return widget.largeChild;
      } else {
        return widget.smallChild;
      }
    } else {
      if (widget.mediumChild == null) {
        return widget.largeChild;
      } else {
        return widget.mediumChild;
      }
    }
  }
}
