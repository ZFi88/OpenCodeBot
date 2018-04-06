using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Runtime.Remoting;
using GH_IO.Serialization;
using Grasshopper.Kernel;
using Rhino.Geometry;
using Socket = Quobject.EngineIoClientDotNet.Client.Socket;

namespace MyNode
{
  public class MyNodeComponent : GH_Component
  {
    private int _resultOut;
    private int _xIn;
    private object _data;
    private Socket _socket;
    private string _botUrl;
    private Status _status = Status.Idle;

    /// <summary>
    /// Each implementation of GH_Component must provide a public 
    /// constructor without any arguments.
    /// Category represents the Tab in which the component will appear, 
    /// Subcategory the panel. If you use non-existing tab or panel names, 
    /// new tabs/panels will automatically be created.
    /// </summary>
    public MyNodeComponent()
      : base("MyNode", "Nickname",
          "Description",
          "Category", "Subcategory")
    {
    }

    /// <summary>
    /// Registers all the input parameters for this component.
    /// </summary>
    protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
    {
      _xIn = pManager.AddTextParameter("bot url", "bot url", "bot url", GH_ParamAccess.item);
    }

    /// <summary>
    /// Registers all the output parameters for this component.
    /// </summary>
    protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
    {
      _resultOut = pManager.AddTextParameter("result", "result", "result", GH_ParamAccess.item);
    }

    /// <summary>
    /// This is the method that actually does the work.
    /// </summary>
    /// <param name="DA">The DA object can be used to retrieve data from input parameters and 
    /// to store data in output parameters.</param>
    protected override void SolveInstance(IGH_DataAccess DA)
    {
      switch (_status)
      {
        case Status.Idle:
          var botUrl = "";
          DA.GetData(_xIn, ref botUrl);
          if (_socket == null && !string.IsNullOrEmpty(botUrl)) OpenSocket(botUrl);
          DA.SetData(_resultOut, _data);
          break;
        case Status.Busy:
          if (_socket == null)
          {
            AddRuntimeMessage(GH_RuntimeMessageLevel.Error, "socket is null");
            return;
          }
          _socket.Send(_data as string);
          _socket.Close();
          _socket = null;
          _status = Status.Idle;
          ExpireSolution(true);
          break;
        default:
          throw new ArgumentOutOfRangeException();
      }
    }

    public override void AddedToDocument(GH_Document document)
    {
      base.AddedToDocument(document);
      if (_botUrl != null) OpenSocket(_botUrl);
    }

    public override void RemovedFromDocument(GH_Document document)
    {
      base.RemovedFromDocument(document);
      _socket.Close();
      _socket = null;
    }

    public override bool Read(GH_IReader reader)
    {
      _botUrl = reader.GetString("url");
      return base.Read(reader);
    }

    public override bool Write(GH_IWriter writer)
    {
      writer.SetString("url", _botUrl);
      return base.Write(writer);
    }

    private void OpenSocket(string botUrl)
    {
      _botUrl = botUrl;
      var socket = new Socket(botUrl);
      _socket = socket;
      socket.On(Socket.EVENT_OPEN, () =>
      {
        socket.On(Socket.EVENT_MESSAGE, (data) =>
        {
          _data = data;
          _status = Status.Busy;
          ExpireSolution(true);
        });
      });
      socket.On(Socket.EVENT_CLOSE, () => { _socket = null; });
      socket.Open();
    }

    /// <summary>
    /// Provides an Icon for every component that will be visible in the User Interface.
    /// Icons need to be 24x24 pixels.
    /// </summary>
    protected override System.Drawing.Bitmap Icon
    {
      get
      {
        // You can add image files to your project resources and access them like this:
        //return Resources.IconForThisComponent;
        return null;
      }
    }

    /// <summary>
    /// Each component must have a unique Guid to identify it. 
    /// It is vital this Guid doesn't change otherwise old ghx files 
    /// that use the old ID will partially fail during loading.
    /// </summary>
    public override Guid ComponentGuid
    {
      get { return new Guid("b6a2352b-b516-473f-a3db-ba481de21a75"); }
    }
  }
}
